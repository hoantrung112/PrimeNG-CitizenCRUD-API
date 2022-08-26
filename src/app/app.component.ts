import { Component, OnInit, Input } from '@angular/core';
import { Citizen } from './citizen';
import { CitizenService } from './citizenService';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: [`
        :host ::ng-deep .p-dialog .citizen-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    citizenDialog: boolean;

    citizens: Citizen[];

    citizen: Citizen;

    cols: any[];

    selectedCitizens: Citizen[];

    _selectedColumns: any[];
    submitted: boolean;

    private readonly itemPerPage = 50;
    private totalRecords = 0;

    constructor(
        private citizenService: CitizenService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    async ngOnInit() {
        // initialize local citizens' data
        this.citizens = [];

        // fetch the first page of citizens
        this.fetchData(this.itemPerPage, 0);

        // if the dataset is greater than 10 -> pagination 
        if (this.totalRecords > this.itemPerPage) {
            const PAGE_COUNT = Math.ceil(this.totalRecords / this.itemPerPage);
            for (let page = 1; page < PAGE_COUNT; page++) {
                this.fetchData(this.itemPerPage, page * this.itemPerPage);
            }
        }
        console.log('citizens...', this.citizens);


        this.cols = [
            { field: 'fullName', header: 'Full name' },
            { field: 'avatar', header: 'Avatar' },
            { field: 'dateOfBirth', header: 'D.O.B' },
            { field: 'gender', header: 'Gender' },
            { field: 'email', header: 'Email' },
            { field: 'identityNumber', header: 'Identity number' },
            { field: 'address', header: 'Address' },
            { field: 'phoneNumber', header: 'Phone number' },
        ];
        this._selectedColumns = this.cols;
    }
    // @Input() get selectedColumns(): any[] {
    //     return this._selectedColumns;
    // }
    // set selectedColumns(val: any[]) {
    //     //restore original order
    //     this._selectedColumns = this.cols.filter(col => val.includes(col));
    // }

    fetchData(max: Number, skip: Number) {
        this.citizenService.getCitizens(max, skip).subscribe((res => {
            let citizenList = res.result.data;
            for (let i = 0; i < citizenList.length; i++) {
                const c = citizenList[i];
                this.citizen = {};
                this.citizen.id = c.id;
                this.citizen.fullName = c.fullName;
                this.citizen.dateOfBirth = (c.dateOfBirth == null) ? null : new Date(c.dateOfBirth).toLocaleDateString();
                // this.citizen.avatar = c.imageUrl || "default-avatar.png";
                this.citizen.avatar = "default-avatar.png";
                this.citizen.identityNumber = c.identityNumber;
                this.citizen.email = c.email;
                this.citizen.gender = c.gender;
                this.citizen.nationality = c.nationality;
                this.citizen.address = c.address;
                this.citizen.phoneNumber = c.phoneNumber;
                this.citizens.push(this.citizen);
            };
            // update total records
            this.totalRecords = res.result._totalRecords;
            console.log(res.result._totalRecords, '\n', this.totalRecords);

        }))
    }

    openNew() {
        this.citizen = {};
        this.submitted = false;
        this.citizenDialog = true;
    }

    deleteSelectedCitizens() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected citizens?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.citizens = this.citizens.filter(val => !this.selectedCitizens.includes(val));
                for (let i = 0; i < this.selectedCitizens.length; i++) {
                    const c = this.selectedCitizens[i];
                    this.citizenService.deleteCitizen(c.id).subscribe(res => {
                        console.log(`Attempting deleting citizen id = ${c.id}...`, res);
                    })
                }

                this.selectedCitizens = null;

                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Citizens deleted successfully!', life: 3000 });
            }
        });
    }

    editCitizen(citizen: Citizen) {
        this.citizen = { ...citizen };
        this.citizenDialog = true;
    }

    deleteCitizen(citizen: Citizen) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + citizen.fullName + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // TODO : call DELETE Request

                // delete locally
                this.citizens = this.citizens.filter(val => val.id !== citizen.id);
                this.citizen = {};

                // delete on server
                this.citizenService.deleteCitizen(citizen.id).subscribe(res => {
                    console.log(`Attempting deleting citizen id = ${citizen.id}...`, res);
                })

                // notify user
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Citizen deleted successfully!', life: 3000 });
            }
        });
    }

    hideDialog() {
        this.citizenDialog = false;
        this.submitted = false;
    }

    createOrUpdateCitizen() {
        this.submitted = true;

        if (this.citizen.fullName.trim()) {
            if (this.citizen.id) {
                // TODO : Call update request API

                // Update on server
                this.citizenService.createOrUpdateCitizen(this.citizen).subscribe(res => {
                    // Update locally
                    this.citizens[this.findIndexById(this.citizen.id)] = this.citizen;
                    console.log("Attempting updating a citizen...", res);
                })
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Citizen updated successfully!', life: 3000 });
            }
            else {
                this.citizen.id = 0;
                this.citizen.avatar = 'default-avatar.png';
                this.citizen.dateOfBirth = new Date(this.citizen.dateOfBirth).toLocaleDateString();

                this.citizenService.createOrUpdateCitizen(this.citizen).subscribe(res => {
                    console.log("citizen...\n", this.citizen);
                    console.log("res...\n", res);
                    this.citizens.push(this.citizen);
                })
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Citizen created successfully!', life: 3000 });
            }

            this.citizens = [...this.citizens];
            this.citizenDialog = false;
            this.citizen = {};
        }
        // reload page
        window.location.reload();
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.citizens.length; i++) {
            if (this.citizens[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
}
